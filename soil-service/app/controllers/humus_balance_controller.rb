class HumusBalanceController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def index
    render json: HumusBalanceCalculator.call
  end

  def recalculate
    render json: HumusBalanceCalculator.call(fields_params)
  end

  private

  def fields_params
    params.permit(fields: [:id, crops: [:year, crop: [:value, :humus_delta]]])[:fields]
  end
end
