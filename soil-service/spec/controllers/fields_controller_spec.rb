require 'rails_helper'

RSpec.describe FieldsController, type: :controller do
  describe 'GET humus_balance' do
    context 'when field ids are not provided' do
      it 'returns json result with humus balance for all fields' do
        post :humus_balance

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq [
          { 'id' => 1, 'value' => -3 },
          { 'id' => 2, 'value' => 2 },
          { 'id' => 3, 'value' => -12.399999999999999 },
        ]
      end
    end

    context 'when field ids are provided' do
      it 'returns json result with humus balance for fields which has provided ids' do
        post :humus_balance, params: { fields: [FieldsService.instance.fetch_fields[0]] }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq [{ 'id' => 1, 'value' => -3 }]
      end
    end
  end
end
