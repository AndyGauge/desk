class AddEmployeeToUser < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :employee
    User.all.each do |u|
      u.employee_id = Employee.where("E-Mail Address".to_sym => u.email).first.id
      u.save
    end
  end
end
