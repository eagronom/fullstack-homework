require 'rails_helper'

RSpec.describe Fields::HumusBalanceService do
  describe '#call' do
    subject { described_class.new(crops: crops).call }

    let(:crops) { [1, 8, 3] }

    it 'calculate humus balance' do
      expect(subject).to eq(19.11)
    end
  end
end
