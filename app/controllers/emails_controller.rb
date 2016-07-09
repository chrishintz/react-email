class EmailsController < ApplicationController

  def index
    render json: Email.all
  end

  def create
    @email = Email.new(params.require(:email).permit(:to, :from, :subject, :body))
    if @email.save
      render json: @email, status: 201
    else
      render json: @email.errors, status: 400
    end
  end

end
