# Here we simulate a database connection with Fields
class HumusBalanceService
    include Singleton

    CONCECUTIVE_YEAR_MULTIPLY = 1.3
  
    def get_balance(parameters)
      validate_parameters(parameters)
      humus_balance = calculate_humus_balance(@year_crop_mapping)
      previous_humus_balance = calculate_humus_balance(@field[:crops])
      {
            field_id: @field[:id],
            humus_balance: humus_balance,
            previous_humus_balance: previous_humus_balance,
      }
    end

    private
    def validate_parameters(parameters)
      raise ApiExceptions::HumusBalanceError::MissingFieldIdError.new unless parameters[:field_id]
      field_id = parameters[:field_id].to_i
      raise ApiExceptions::HumusBalanceError::FieldDoesNotExistError.new unless @field = FieldsService.instance.get_field(field_id)
      @year_crop_mapping = parameters[:years].to_hash().sort_by {|year| year}.map do|elem|
        year = elem[0]
        raise ApiExceptions::HumusBalanceError::CropDoesNotExistError.new unless crop = CropsService.instance.get_crop(elem[1].to_i)
        {
          year: year,
          crop: crop
        }
      end
    end

    private
    def calculate_humus_balance(year_crop_mapping)
      year_crop_mapping.reduce({humus_balance:0.0, crop_value:nil}) do |previous, current|
        delta = current[:crop][:humus_delta].to_f
        humus_balance = previous[:humus_balance] + ( current[:crop][:value] == previous[:crop_value] ? delta * CONCECUTIVE_YEAR_MULTIPLY : delta )
        {
          humus_balance: humus_balance,
          crop_value: current[:crop][:value]
        }
      end[:humus_balance]
    end
  end
