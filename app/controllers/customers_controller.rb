class CustomersController < ApplicationController
  before_action :set_customer, only: [:show, :edit, :update, :destroy, :contacts, :connections, :incidents, :sites, :machines]
  before_action :whitelisted
  before_action :cdesk_authorized

  # GET /customers
  # GET /customers.json
  def index
    @customers = Customer.all
  end

  # GET /customers/1
  # GET /customers/1.json
  def show
    set_device_types_and_actions
  end

  # GET /customers/new
  def new
    @customer = Customer.new
  end

  # GET /customers/1/edit
  def edit
  end

  # POST /customers
  # POST /customers.json
  def create
    @customer = Customer.new(customer_params)

    respond_to do |format|
      if @customer.save
        format.html { redirect_to @customer, notice: 'Customer was successfully created.' }
        format.json { render :show, status: :created, location: @customer }
      else
        format.html { render :new }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /customers/1
  # PATCH/PUT /customers/1.json
  def update
    respond_to do |format|
      if @customer.update(customer_params)
        format.html { redirect_to @customer, notice: 'Customer was successfully updated.' }
        format.json { render :show, status: :ok, location: @customer }
      else
        format.html { render :edit }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /customers/1
  # DELETE /customers/1.json
  def destroy
    @customer.destroy
    respond_to do |format|
      format.html { redirect_to customers_url, notice: 'Customer was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def contacts
    render json: @customer.contacts
  end

  def connections
    render json: @customer.connections.sort_by{|a| a[:"device type"].to_s.upcase }
  end

  def incidents
    render json: FetchIncidentsService.new.by_customer(@customer.id)
  end

  def sites
    render json: @customer.sites.map { |s| s.as_json.merge(map_link: s.map_link) }
  end

  def machines
    render json: @customer.machines.order(:machname).map { |m| m.as_json.merge(live_connect: m.live_connect)}
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_customer
      @customer = Customer[params[:id]]
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def customer_params
      params.require(:customer).permit(:company, :contact, :phone, :address, :city, :state, :cdeskid)
    end

  def set_device_types_and_actions
    @device_types =  Desk::DataSource.cdesk[:"lu- Device Type"].all.map{ |type| type[:"device type"]}.sort
    @actions = Desk::DataSource.cdesk[:"lu- Actions"].all.map{|act| act[:action]}
    @employee_id = {employee_id: current_user.employee_id}
  end
end
