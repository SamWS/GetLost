module Api

  class UserseventsController < ApplicationController

    def create
      @join = Usersevent.new
      user = User.find_by(id: session[:id])
      @join.user_id = user.id
      @join.event_id = params[:event_id]
      @join.save
      
    end

  end


end