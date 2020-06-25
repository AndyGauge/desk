class ContactsController < ApplicationController
  before_action :whitelisted
  before_action :cdesk_authorized

  def update
    contact = Contact[params[:id]]
    contact.set_from_params params[:contact]
    contact.save_changes
    render json: contact
  end

  def create
    contact = Contact.new
    contact.set_from_params params[:contact]
    #contact.customerid = params[:contact][:customerid]
    contact.save_changes
    render json: contact
  end

end
