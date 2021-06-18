require 'rails_helper'

RSpec.describe HumusBalanceService do
  describe '#get_balance' do
    it 'returns empty result by default' do
        expect(HumusBalanceService.instance.get_balance({})).to eq({field_id:nil})
    end
  end
end
