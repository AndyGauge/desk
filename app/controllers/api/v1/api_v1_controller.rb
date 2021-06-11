module Api
  module V1
    class ApiV1Controller < ActionController::Base
      before_action :authenticate_jwt
      before_action :configure_permitted_parameters, if: :devise_controller?
      before_action :whitelisted?

      protect_from_forgery with: :null_session


      def cleanup_binary_data(hash_or_array)
        case hash_or_array
        when Array
          hash_or_array.map do |hash|
            cleanup_binary_data_hash(hash)
          end
        when Hash
          cleanup_binary_data_hash(hash_or_array)
        else
          throw "CleanupBinaryDataDataTypeNotSupported"
        end


      end

      def cleanup_binary_data_hash(hash)
        if hash[:upsize_ts]
          hash[:upsize_ts] = (hash[:upsize_ts].unpack "L_").first
        end
        hash
      end

      def whitelisted
        redirect_to '/' unless whitelisted?
      end

      def whitelisted?
        @whitelisted ||= Whitelist.contains? request.remote_ip
      end

      def cdesk_authorized
        redirect_to '/' unless current_user&.employee_id
      end

      def authenticate_jwt
        @current_user=User.authenticate_by_jwt params[:jwt]
        unless @current_user
          render json: {"error": "not authorized"}, status: 401 and return
        end
      end

      protected

      def configure_permitted_parameters
        # devise 4.3 .for method replaced by .permit
        devise_parameter_sanitizer.permit(:sign_in, keys: [:username])
        # devise_parameter_sanitizer.for(:sign_in) << :username
      end

      rescue_from DeviseLdapAuthenticatable::LdapException do |exception|
        render :text => exception, :status => 500
      end


    end
  end
end
