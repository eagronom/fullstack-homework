require 'rails_helper'

RSpec.describe CropsService do
  describe '#fetch_all_crops' do
    subject(:fetch_all_crops) { described_class.instance.fetch_all_crops }

    it 'returns all crops' do
      expect(fetch_all_crops).to contain_exactly(
        { value: 1, label: 'Spring Wheat', humus_delta: -2 },
        { value: 2, label: 'Winter Wheat', humus_delta: -1 },
        { value: 3, label: 'Red Clover', humus_delta: 2 },
        { value: 4, label: 'White Clover', humus_delta: 1 },
        { value: 5, label: 'Broad Bean', humus_delta: 3 },
        { value: 6, label: 'Oats', humus_delta: 0 }
      )
    end
  end
end
