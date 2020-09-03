require 'netaddr'
class Whitelist
  ALLOWED_IP = [
      '192.168.0.0/16',
      '127.0.0.1/32'
  ]

  def self.contains?(test_ip)
    ALLOWED_IP.each do |ip|
      return true if NetAddr::IPv4Net.parse(ip).contains NetAddr::IPv4.parse(test_ip) rescue true
    end
    false
  end

end
