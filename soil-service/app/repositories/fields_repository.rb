class FieldsRepository
  def initialize(fields)
    @fields = fields
  end

  def call
    fields.map do |field|
      crops = field[:crops].map { |crop| crop[:crop][:humus_delta] }
      field.merge('humus_balance' => ::Fields::HumusBalanceService.new(crops: crops).call)
    end
  end

  private
  attr_reader :fields
end
