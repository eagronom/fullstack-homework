class HumusBalanceCalculatorContract < Dry::Validation::Contract
  Dry::Validation.load_extensions(:monads)

  schema do
    required(:id).value(:integer)
    required(:crops).value(:array).each do
      schema do
        required(:year).value(:integer)
        required(:crop).schema do
          required(:value).value(:integer)
          required(:humus_delta).value(:integer)
        end
      end
    end
  end
end
