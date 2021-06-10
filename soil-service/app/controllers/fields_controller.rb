class FieldsController < ApplicationController
  def index
    fields = FieldsService.instance.fetch_fields
    repo = FieldsRepository.new(fields).call
    render json: repo
  end

  def humus_balance
    humus_balance = Fields::HumusBalanceService.new(crops: params[:crops]).call
    render json: { humus_balance: humus_balance }
  end
end
