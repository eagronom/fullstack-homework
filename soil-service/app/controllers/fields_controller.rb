class FieldsController < ActionController::Base
  def index
    render json: FieldsService.instance.fetch_fields
  end

  def humus_balance
    humus_balance = Fields::HumusBalanceService.new(crops: params[:crops]).call
    render json: { humus_balance: humus_balance }
  end
end
