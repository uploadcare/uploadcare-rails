class Uploadcare::Rails::Error < RuntimeError
end

class Uploadcare::Rails::InstallationError < Uploadcare::Rails::Error
end

class Uploadcare::Rails::CommunicationError < Uploadcare::Rails::Error
end

class Uploadcare::Rails::DatabaseError < Uploadcare::Rails::Error
end