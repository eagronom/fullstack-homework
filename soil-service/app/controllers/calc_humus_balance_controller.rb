class CalcHumusBalanceController < ActionController::Base
  skip_before_action :verify_authenticity_token, only: [:create]
  def create
    render plain: CalcHumusBalanceService.instance.get_humus_balance(request.body.read)
  end
end
