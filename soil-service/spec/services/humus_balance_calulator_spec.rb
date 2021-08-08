require 'rails_helper'

RSpec.describe HumusBalanceCalculator do
  describe '.call ' do
    subject(:call) { described_class.call(field_params) }

    context 'with correct input' do
      let(:field_params) do
        {
          id: 1,
          crops: [
            { year: 2121, crop: { value: 1, humus_delta: -1 }},
            { year: 2122, crop: { value: 1, humus_delta: -1 }},
            { year: 2123, crop: { value: 2, humus_delta: 2 }}
          ]
        }
      end

      it 'succeeded' do
        expect(call.success?).to be true
      end

      it 'returns correctly calculated value' do
        expect(call.value![:humus_balance]).to be_within(0.1).of(-0.3)
      end
    end

    context 'with invalid input' do
      let(:field_params) { {id: 1, crops: [{year: 2121, crop: {value: 1, humus_delta: 'Bad argument'}}]} }

      it 'fails' do
        expect(call.failure?).to be true
      end

      it 'returns error message' do
        expect(call.failure.errors(full: true).to_h).to match({ crops: { 0 => { crop: { humus_delta: ["humus_delta must be an integer"] } } } })
      end
    end
  end
end
