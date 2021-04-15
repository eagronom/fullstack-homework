class FieldsController < ActionController::Base
  def index
    render json: FieldsService.instance.fetch_fields
  end
end
