# Handle humus balance calculation for crops
class HumusBalanceService
  CONSECUTIVE_YEAR_COEFFICIENT = 1.3

  attr_reader :fields

  def initialize(fields = nil)
    @fields = fields || FieldsService.instance.fetch_fields
  end

  def perform
    fields.map { |field| { id: field[:id].to_i, value: field_humus_balance(field[:crops]) } }
  end

  private

  def field_humus_balance(crops)
    crops = crops.sort_by { |crop| crop[:year] }.pluck(:crop)

    crops.each_with_index.inject(0) do |sum, (crop, index)|
      previous_crop = index.positive? ? crops[index - 1] : {}
      humus_delta = crop[:humus_delta].to_i

      balance = crop[:value] == previous_crop[:value] ? humus_delta * CONSECUTIVE_YEAR_COEFFICIENT : humus_delta
      sum + balance
    end
  end
end
