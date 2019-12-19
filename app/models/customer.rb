class Customer < ApplicationRecord
	default_scope { order(company: :asc) }
end
