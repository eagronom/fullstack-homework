require 'rails_helper'

RSpec.describe HumusBalancesCalculator do
  describe '.call ' do
    subject(:call) { described_class.call(fields_params) }

    context 'with correct input' do
      let(:fields_params) do
        [
          {
            id: 1,
            crops: [
              { year: 2121, crop: { value: 1, humus_delta: -1 }},
              { year: 2122, crop: { value: 2, humus_delta: -3 }},
              { year: 2123, crop: { value: 3, humus_delta: 2 }},
              { year: 2124, crop: { value: 4, humus_delta: 1 }}
            ]
          },
          {
            id: 2,
            crops: [
              { year: 2121, crop: { value: 1, humus_delta: -1 }},
              { year: 2122, crop: { value: 3, humus_delta: 0 }},
              { year: 2123, crop: { value: 2, humus_delta: 2 }}
            ]
          }
        ]
      end

      it 'succeeded' do
        expect(call.success?).to be true
      end

      it 'returns correct values count' do
        expect(call.value!.count).to match(2)
      end

      it 'returns correctly calculated values' do
        humus_balance_values = call.value!.map{ |value| value[:humus_balance] }
        expect(humus_balance_values).to match([-1, 1])
      end
    end

    context 'with invalid input' do
      let(:fields_params) {
        [
          { id: 1, crops: [{ year: 2121, crop: { value: '1', humus_delta: -1 }}]},
          { id: 2, crops: [{ year: 2121, crop: { value: 1, humus_delta: -1 }}]}
        ]
      }

      it 'fails' do
        expect(call.failure?).to be true
      end

      it 'returns error message' do
        expect(call.failure.errors(full: true).to_h).to match({ crops: { 0 => { crop: { value: ["value must be an integer"] } } } })
      end
    end
  end
end
