class ImportFromCdeskService
    require 'tiny_tds'

    @@c_desk_sql = {
        :adapter  => 'tinytds',
        :host     => ENV.fetch("CDESKSQL"),
        :database => ENV.fetch('CDESKDB'),
        :username => ENV.fetch("CDESKUSERNAME"),
        :password => ENV.fetch("CDESKPASSWORD")
    }

    def initialize
        c_desk_client = TinyTds::Client.new @@c_desk_sql

        customers = c_desk_client.execute("SELECT ID, Company, [First Name] as first, [Last Name] as last, [Business Phone] as phone, Address as address, City as city, [State/Province] as state FROM Customers")
        customers.each do |client|
            c = Customer.find_or_create_by(cdeskid: client["ID"])
            c.update({
                company: client["Company"],
                contact: [client["first"], client["last"]] * " ",
                phone:   client["phone"],
                address: client["address"],
                city:    client["city"],
                state:   client["state"]
            })
        end
    end

end