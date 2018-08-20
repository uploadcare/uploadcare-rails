module Uploadcare
  module Rails
    class Operations
      def initialize(operations = nil)
        @operations = operations
      end

      def to_s
        return '' unless @operations

        result = @operations.map do |operation, options|
          next unless respond_to?(operation)
          send(operation, options)
        end

        ['-/', result.join('/-/'), '/'].
          join.
          gsub(%r{\/+}, '/').
          to_s
      end

      def format(options)
        return unless %w(png jpeg).include?(options.to_s)
        "format/#{ options }"
      end

      def progressive(options)
        return unless %w(yes no).include?(options.to_s)
        "progressive/#{ options }"
      end

      def quality(options)
        available_options = %w(normal better best lighter lightest)
        return unless available_options.include?(options.to_s)
        "quality/#{ options }"
      end

      def preview(options)
        if option = options[/^\d+x\d+$/]
          "preview/#{ option }"
        else
          "preview/"
        end
      end

      def resize(options)
        if option = options[/^(\d+x\d+)$|^(\d+x)$|^(x\d+)$/]
          "resize/#{ option }"
        end
      end

      def scale_crop(options)
        if option = options[/^\d+x\d+(\/center)?$/]
          "scale_crop/#{ option }"
        end
      end

      alias_method :size, :resize

      def inline(options)
        options
      end
    end
  end
end
