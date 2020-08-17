<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Scripts Class
 *
 * Handles adding scripts functionality to the front pages
 * as well as the front pages.
 *
 * @package Email Capture & Lead Generation
 * @since 1.0.0
 */
class Eclg_Scripts {

	public function __construct() {

		add_action( 'wp_enqueue_scripts', array( $this, 'eclg_public_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'eclg_admin_scripts' ), 30 );

	}

	/**
	 * Enqueue Scripts
	 *
	 * Enqueue Scripts for public
	 *
	 * @package Email Capture & Lead Generation
	 * @since 1.0.0
	 */

	public function eclg_public_scripts() {

		// Add style css
		wp_register_style( 'eclg-style', ECLG_PLUGIN_URL . '/css/eclg-style.css', array(), ECLG_VERSION );

		// Enqueue form style
		wp_enqueue_style( 'eclg-style' );

		wp_register_script( 'eclg-public-js', ECLG_PLUGIN_URL . '/js/eclg-public.js', array( 'jquery' ), ECLG_VERSION );

		// localization script
		wp_localize_script(
			'eclg-public-js',
			'EcLg',
			array(
				'ajaxurl'     => admin_url( 'admin-ajax.php' ),
				'fname_empty' => __( 'Please enter your firstname.', 'email-capture-lead-generation' ),
				'lname_empty' => __( 'Please enter your lastname.', 'email-capture-lead-generation' ),
				'email_empty' => __( 'Please enter email address.', 'email-capture-lead-generation' ),
				'email_valid' => __( 'Please enter valid email address.', 'email-capture-lead-generation' ),
			)
		);

		// Enqueue form scripts
		wp_enqueue_script( 'eclg-public-js' );
	}


	/**
	 * Hook the scripts and styles required in admin side.
	 *
	 * @since 1.0.2
	 */
	public function eclg_admin_scripts() {

		$dep_file_url = sprintf( '%s/app/build/admin.asset.php', ECLG_PLUGIN_DIR );

		wp_enqueue_style( 'wp-components' );

		$deps = file_exists( $dep_file_url ) ? include_once sprintf( '%s/app/build/admin.asset.php', ECLG_PLUGIN_DIR ) : '';

		if ( is_array( $deps ) && ! empty( $deps ) ) {
			wp_register_script( 'eclg-admin-scripts', ECLG_PLUGIN_URL . '/app/build/admin.js', $deps['dependencies'], $deps['version'], true );
			wp_enqueue_script( 'eclg-admin-scripts' );
		}

	}

}

return new Eclg_Scripts();
