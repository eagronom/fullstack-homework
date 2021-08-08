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
