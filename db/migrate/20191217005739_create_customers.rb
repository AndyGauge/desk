class CreateCustomers < ActiveRecord::Migration[6.0]
  def change
    create_table :customers do |t|
      t.string :company
      t.string :contact
      t.string :phone
      t.string :address
      t.string :city
      t.string :state
      t.integer :cdeskid

      t.timestamps
    end
  end
end
