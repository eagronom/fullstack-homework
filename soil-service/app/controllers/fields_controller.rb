class FieldsController < ActionController::Base
  skip_before_action :verify_authenticity_token, only: [:humus_balance]

  def index
    render json: FieldsService.instance.fetch_fields
  end

  def humus_balance
    render json: HumusBalanceService.new(humus_balance_params).perform
  end

  private

  def humus_balance_params
    params[:fields]&.any? && params.require(:fields)
  end
end
