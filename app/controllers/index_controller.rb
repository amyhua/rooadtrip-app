class IndexController < ApplicationController

  def index
    @yammer_client_id = 'F7yoyoOJh8Zo7IExarIyw';
  end

  def login
    @user = { name: 'Amy Hua' }
  end
end
