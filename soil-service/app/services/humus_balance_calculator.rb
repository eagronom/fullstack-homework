class HumusBalanceCalculator
  CONSECUTIVE_MULTIPLIER = 1.3

  def initialize(fields = nil)
    @fields =
      if fields.nil?
        init_fields
      else
        fields
      end
  end

  def call
    @fields.map do |field|
      { field_id: field[:id], humus_balance: calculate_balance(field) }
    end
  end

  def self.call(*args, &block)
    new(*args, &block).call
  end

  private

  def init_fields
    ::FieldsService.instance.fetch_fields
  end

  def calculate_balance(field)
    previous_crop_value = nil
    consecutive_coefficient = 1
    field[:crops].sort_by{ |seasonal_crop| seasonal_crop[:year] }.reduce(0) do |humus_balance, seasonal_crop|
      crop = seasonal_crop[:crop]
      consecutive_coefficient = previous_crop_value == crop[:value] ? consecutive_coefficient * CONSECUTIVE_MULTIPLIER : 1
      previous_crop_value = crop[:value]
      humus_balance + crop[:humus_delta] * consecutive_coefficient
    end
  end
end
