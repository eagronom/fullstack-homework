require 'rails_helper'

RSpec.describe FieldsService do
  describe '#fetch_fields' do
    subject(:fetch_fields) { described_class.instance.fetch_fields }

    it 'returns fields objects' do
      expect(fetch_fields).to all(
        include(
          id: an_instance_of(Integer),
          name: an_instance_of(String),
          area: an_instance_of(Float)
        )
      )
    end

    it 'has crops for 5 years' do
      fetch_fields.each do |field|
        expect(field[:crops]).to match_array(
          [
            include(year: 2020),
            include(year: 2021),
            include(year: 2022),
            include(year: 2023),
            include(year: 2024),
          ]
        )
      end
    end
  end
end
