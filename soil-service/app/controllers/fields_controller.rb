class FieldsController < ApplicationController
  def index
    @fields = FieldsService.instance.fetch_fields.deep_dup
    render json: calculate_humus_balance(@fields.as_json)
  end

  def update
    @fields = [fields_params['new_crop_selection'].as_json]
    render json: calculate_humus_balance(@fields)
  end

  private

  def calculate_humus_balance(fields_array)
    sum_of_humus_balance = 0
    fields_array.each do |field|
      determine_if_crops_on_the_land_consecutively(field['crops'])
      field['crops'].each do |crop|
        sum_of_humus_balance += crop['crop']['humus_delta']
      end
      field['humus_balance'] = sum_of_humus_balance.round(2)
      sum_of_humus_balance = 0
    end
    fields_array
  end

  def determine_if_crops_on_the_land_consecutively(crop_array)
    sorted_crops = crop_array.sort_by { |crop_detail| crop_detail['year'] }
    consecutive_sequences = sorted_crops.chunk_while { |initial_val, next_val|
      initial_val['crop']['label'] == next_val['crop']['label'] &&
        initial_val['year'] + 1 == next_val['year']
    }.to_a
    consecutive_sequences.each do |sequence|
      next unless sequence.length > 1

      # only multiply the effect for the repeating year not the first year
      sequence[1..].each do |crop_obj|
        crop = crop_obj['crop']
        crop['humus_delta'] = get_actual_crop_humus_delta(crop_obj['crop']['label']) * 1.3
      end
    end
  end

  def get_actual_crop_humus_delta(crop_name)
    crops_index = CropsService.instance.fetch_all_crops
    crop = crops_index.select { |item| item[:label] == crop_name }
    crop[0][:humus_delta]
  end

  def fields_params
    params.require(:field).permit(
      new_crop_selection: [
        :id, :name, :area, :humus_balance,
        crops: [:year, crop: %i[year id label humus_delta]],
      ]
    )
  end
end
