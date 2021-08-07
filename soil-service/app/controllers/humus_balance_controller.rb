class HumusBalanceController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def index
    render json: HumusBalanceCalculator.call
  end

  def calculate
    render json: HumusBalanceCalculator.call([field_params]).last
  end

  private

  def field_params
    params.require(:field).permit(:id, crops: [:year, crop: [:value, :humus_delta]])
  end
end
