# Class accepts array of params for fields with structure defined in the ::HumusBalanceCalculatorContract or nothing.
# When it is called without arguments fetches data from the ::FieldService.
# As a result returns the Result monad https://dry-rb.org/gems/dry-monads/1.3/result/ which can be Success or Failure
# Success result can be unwrapped by commands .value! for Success and .failure for Failure
# @example
#  result = HumusBalancesCalculator.call(fields_params)
# or
#  result = HumusBalancesCalculator.call
# Unwrap
#  result.value! if result.success?
#  or
#  result.failure if result.failure?
class HumusBalancesCalculator < ApplicationService
  def initialize(fields_params = nil)
    @fields_params =
      if fields_params.nil?
        ::FieldsService.instance.fetch_fields
      else
        fields_params
      end
  end

  def call
    result =
      @fields_params.map do |field_params|
        yield HumusBalanceCalculator.call(field_params)
      end
    Success(result)
  end
end
