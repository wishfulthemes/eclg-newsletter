<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * Scripts Class
 *
 * Html for eclg form
 *
 * @package Email Capture & Lead Generation
 * @since 1.0.0
 */
class Eclg_Shortcodes {
	
	public function __construct(){
		
		// Shortcode to print newletter form 
		// Shortcode : [eclg_capture lastname="yes" firstname="yes" button_text="Send"]
		add_shortcode( 'eclg_capture', array($this, 'eclg_email_form_shortcode') );

		//Use shortcode in widget
		add_filter('widget_text','do_shortcode');

	}
	
	/**
	 * Adding Html
	 *
	 * Adding html for front end side.
	 *
	 * @package Email Capture & Lead Generation
	 * @since 1.0.0
	 */
	function eclg_email_form_shortcode( $atts, $content ) {
		
		// Getting attributes of shortcode
		extract( shortcode_atts( array(
			'button_text'	=> __( 'Submit', 'eclg-newsletter' ),
			'firstname'	=> 'yes',
			'lastname'	=> 'yes',
		), $atts ) );
		
		ob_start(); ?>

		<div class="eclg-email-capture">
			<form  id="eclg-form" >
				<?php
				if( $firstname == 'yes' ) { ?>
					<div class="input-field">
						<label><?php echo __( 'First Name', 'eclg-newsletter' ); ?></label>
						<input type="text" name="first_name" class="eclg_firstname" />
					</div>
				<?php } ?>

				<?php
				if( $lastname == 'yes' ) { ?>
					<div class="input-field">
						<label><?php echo __( 'Last Name', 'eclg-newsletter' ) ?></label>
						<input type="text" name="last_name" class="eclg_lastname">
					</div>
				<?php } ?>

				<div class="input-field">
					<label><?php echo __( 'Email', 'eclg-newsletter' ); ?></label>
					<input type="text" name="email" class="eclg_email">
				</div>

				<div class="input-field input-submit">
					<button type="button" id="eclg-submit-btn" ><?php echo $button_text; ?> </button>
					
					<div class="eclg_ajax_loader" style="display: none;"><img src="<?php echo ECLG_PLUGIN_URL; ?>/images/ajax_loader.gif"></div>
				</div>
				<div class="eclg-message-container"></div>
			</form>
		</div>

		<?php
		$content .= ob_get_clean();
		return $content;
	}
}

return new Eclg_Shortcodes();
