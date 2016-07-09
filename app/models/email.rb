class Email < ActiveRecord::Base

  validates :to, :from, :subject, :body, presence: true

end
