require 'rails_helper'

RSpec.describe HumusBalanceService do
  describe '#perform' do
    subject { described_class.new(field_ids).perform }

    let(:field_ids) { nil }

    context 'when field ids are empty' do
      it 'returns humus calculation form all fields' do
        expect(subject).to eq [
          { id: 1, value: -3 },
          { id: 2, value: 2 },
          { id: 3, value: -12.399999999999999 },
        ]
      end
    end

    context 'when field ids are not empty' do
      let(:field_ids) { [FieldsService.instance.fetch_fields[0]] }

      it 'returns humus calculation form all fields' do
        expect(subject).to eq [{ id: 1, value: -3 }]
      end
    end
  end
end
