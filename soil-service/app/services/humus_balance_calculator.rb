# Calculates a humus balance for the passed field data.
# Class accepts the structure defined in the ::HumusBalanceCalculatorContract. And returns
# When it is called without arguments fetches data from the ::FieldService.
# As a result returns the Result monad https://dry-rb.org/gems/dry-monads/1.3/result/ which can be Success or Failure.
# If the result is Success value will be an object with attributes field_id and humus_balance
# Success result can be unwrapped by commands .value! for Success and .failure for Failure
# @example
#  result = HumusBalancesCalculator.call(fields_params)
# or
#  result = HumusBalancesCalculator.call
# Unwrap
#  result.value! if result.success?
#  or
#  result.failure if result.failure?
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
