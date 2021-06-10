class CropsController < ApplicationController
  def index
    render json: CropsService.instance.fetch_all_crops
  end
end
