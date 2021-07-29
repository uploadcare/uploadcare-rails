# frozen_string_literal: true

require 'uploadcare/errors/type_error'

module Uploadcare
  module Rails
    module Transformations
      # A class for building image urls after image transformations.
      class ImageTransformations
        def initialize(options = {})
          @options = options.map { |k, v| [k.to_sym, v] }.to_h
        end

        def call
          [resize_part, compression_part, color_part, blur_part, overlay_part, rotate_part]
            .compact
            .join('-')
            .gsub(/\s/, '')
            .presence
        end

        private

        attr_reader :options

        # rubocop:disable Metrics/AbcSize
        def resize_part
          [
            (preview(options[:preview]) if options.key?(:preview)),
            resize(options[:resize]),
            stretch(options[:stretch]),
            smart_resize(options[:smart_resize]),
            slice_values(:crop, options[:crop], %i[dimensions coords alignment]),
            slice_values(:scale_crop, options[:scale_crop], %i[dimensions offsets smart_mode]),
            setfill(options[:setfill])
          ].compact.join('-').presence
        end
        # rubocop:enable Metrics/AbcSize

        def compression_part
          [
            format(options[:format]),
            quality(options[:quality]),
            progressive(options[:progressive]),
            gif2video(options[:gif2video])
          ].compact.join('-').presence
        end

        # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
        def color_part
          [
            brightness(options[:brightness]),
            exposure(options[:exposure]),
            gamma(options[:gamma]),
            contrast(options[:contrast]),
            saturation(options[:saturation]),
            vibrance(options[:vibrance]),
            warmth(options[:warmth]),
            enhance(options[:enhance]),
            grayscale(options[:grayscale]),
            invert(options[:invert]),
            slice_values(:filter, options[:filter], %i[name amount]),
            srgb(options[:srgb]),
            max_icc_size(options[:max_icc_size])
          ].compact.join('-').presence
        end
        # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

        def blur_part
          [
            slice_values(:blur, options[:blur], %i[strength amount]),
            slice_values(:blur_region, options[:blur_region], %i[dimensions coords strength]),
            blur_faces(options[:blur_faces]),
            sharp(options[:sharp])
          ].compact.join('-').presence
        end

        def overlay_part
          slice_values(:overlay, options[:overlay], %i[uuid relative_dimensions relative_coordinates opacity])
        end

        def rotate_part
          [
            autorotate(options[:autorotate]),
            rotate(options[:rotate]),
            flip(options[:flip]),
            mirror(options[:mirror])
          ].compact.join('-').presence
        end

        def slice_values(key, hash, keys)
          return if hash.nil?
          unless hash.is_a?(Hash)
            raise Uploadcare::Errors::TypeError, "Argument type for for #{key} must be a Hash, #{hash.class} given"
          end

          param_values = keys.map { |k| hash[k] }
          send(key, *param_values)
        rescue NoMethodError
          nil
        end

        # Resize and crop

        def preview(dimensions)
          "/preview/#{dimensions}/".squeeze('/')
        end

        def resize(dimensions)
          "/resize/#{dimensions}/" if dimensions.present?
        end

        def stretch(mode)
          "/stretch/#{mode}/" if mode.present?
        end

        def smart_resize(two_dimensions)
          "/smart_resize/#{two_dimensions}/" if two_dimensions.present?
        end

        def crop(two_dimensions, coords = nil, alignment = nil)
          "/crop/#{two_dimensions}/#{coords}/#{alignment}/".squeeze('/') if two_dimensions.present?
        end

        def scale_crop(two_dimensions, offsets = nil, smart_mode = nil)
          "/scale_crop/#{two_dimensions}/#{offsets}/#{smart_mode}/".squeeze('/') if two_dimensions.present?
        end

        def setfill(color)
          "/setfill/#{color}/" if color.present?
        end

        def format(format)
          "/format/#{format}/" if format.present?
        end

        def quality(quality, smart_mode = nil)
          "/quality/#{quality}/#{smart_mode}/".squeeze('/') if quality.present?
        end

        def progressive(yes_or_no)
          "/progressive/#{yes_or_no}/" if yes_or_no.present?
        end

        def gif2video(value)
          '/gif2video/' if value == true
        end

        # Colors

        %w[brightness exposure gamma contrast saturation vibrance warmth enhance].each do |param|
          define_method param do |value|
            "/#{param}/#{value}/" if value.present?
          end
        end

        def filter(name, amount)
          "/filter/#{name}/#{amount}/" if name.present?
        end

        def srgb(mode)
          "/srgb/#{mode}/" if mode.present?
        end

        def max_icc_size(number)
          "/max_icc_size/#{number}/" if number.present?
        end

        def grayscale(value)
          '/grayscale/' if value == true
        end

        def invert(value)
          '/invert/' if value == true
        end

        # Blur and sharpen

        def blur(strength, amount = nil)
          "/blur/#{strength}/#{amount}/".squeeze('/') if strength.present?
        end

        def blur_region(two_dimensions, two_coords = nil, strength = nil)
          "/blur_region/#{two_dimensions}/#{two_coords}/#{strength}/".squeeze('/')
        end

        def blur_faces(strength)
          "/blur_region/faces/#{strength}/" if strength.present?
        end

        def sharp(strength)
          "/sharp/#{strength}/" if strength.present?
        end

        # Overlay

        def overlay(uuid, relative_dimensions, relative_coordinates, opacity)
          "/overlay/#{uuid}/#{relative_dimensions}/#{relative_coordinates}/#{opacity}/".squeeze('/')
        end

        # Rotate and flip

        def autorotate(yes_or_no)
          "/autorotate/#{yes_or_no}/" if yes_or_no.present?
        end

        def rotate(angle)
          "/rotate/#{angle}/" if angle.present?
        end

        def flip(value)
          '/flip/' if value == true
        end

        def mirror(value)
          '/mirror/' if value == true
        end
      end
    end
  end
end
