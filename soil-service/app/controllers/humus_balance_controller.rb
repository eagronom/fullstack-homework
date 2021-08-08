class HumusBalanceController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def index
    result = HumusBalancesCalculator.call
    if result.success?
      render json: result.value!
    else
      render(json: result.failure.errors(full: true).to_h, status: :bad_request)
    end
  end

  def calculate
    result = HumusBalanceCalculator.call(field_params)
    if result.success?
      render json: result.value!
    else
      render(json: result.failure.errors(full: true).to_h, status: :bad_request)
    end
  end

  private

  def field_params
    params.require(:field).permit(:id, crops: [:year, crop: [:value, :humus_delta]]).to_h
  end
end
