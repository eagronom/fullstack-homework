require 'rails_helper'

RSpec.describe "Fields", type: :request do
  describe "GET /field/humus_balance" do
    it "return humus_balance" do
      post humus_balance_field_path, params: { crops: [1, 8, 3] }, as: :json
      expect(JSON.parse(response.body)).to eq('humus_balance' => 19.11)
    end
  end
end
