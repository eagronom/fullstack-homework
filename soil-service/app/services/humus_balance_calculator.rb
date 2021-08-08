class HumusBalanceCalculator < ApplicationService
  CONSECUTIVE_MULTIPLIER = 1.3

  def initialize(field_params)
    @field_params = field_params
  end

  def call
    field = yield HumusBalanceCalculatorContract.new.call(@field_params).to_monad
    Success({ field_id: field[:id], humus_balance: calculate_balance(field).round(2) })
  end

  private

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
