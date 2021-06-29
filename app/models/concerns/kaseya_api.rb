module KaseyaApi
  extend ActiveSupport::Concern

  def vsa
    @vsa ||= Kaseya::VSA.authenticate(ENV.fetch("KASEYA_HOST"), ENV.fetch("KASEYA_USER"), ENV.fetch("KASEYA_PASS"))
  end
end