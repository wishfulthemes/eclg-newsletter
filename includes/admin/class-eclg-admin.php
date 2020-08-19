<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Admin Pages Class
 *
 * Handles generic Admin functionailties
 *
 * @package Email Capture & Lead Generation
 * @since 1.0.0
 */
class Eclg_Admin {


	public function __construct() {

		add_action( 'admin_menu', array( $this, 'eclg_ltable_add_menu_page' ) );

		add_action( 'admin_init', array( $this, 'wpesn_ltable_process_bulk_action' ) );

		add_action( 'wp_ajax_eclg_save_data', array( $this, 'eclg_save_data' ) );
	}

	/**
	 * Creat menu page
	 *
	 * Adding required menu pages and submenu pages
	 * to manage the plugin functionality
	 *
	 * @package Email Capture & Lead Generation
	 * @since 1.0.0
	 */
	public function eclg_ltable_add_menu_page() {

		$eclg_setting = add_menu_page(
			__( 'Email Capture & Lead Generation', 'email-capture-lead-generation' ),
			__( 'Email Capture & Lead Generation', 'email-capture-lead-generation' ),
			'manage_options',
			'eclg-list',
			array(
				$this,
				'eclg_ltable_newsletter_list',
			),
			'dashicons-email-alt2'
		);

		/**
		 * Duplicate the parent menu page to submenu so that we can remove the extra submenu created by parent menu page.
		 *
		 * Credit @see: https://developer.wordpress.org/reference/functions/add_submenu_page/#comment-446
		 *
		 * @since 1.0.2
		 */
		add_submenu_page(
			'eclg-list',
			__( 'Lists', 'email-capture-lead-generation' ),
			__( 'Lists', 'email-capture-lead-generation' ),
			'manage_options',
			'eclg-list',
			array(
				$this,
				'eclg_ltable_newsletter_list',
			)
		);

		/**
		 * @since 1.0.2
		 */
		add_submenu_page(
			'eclg-list',
			__( 'Settings', 'email-capture-lead-generation' ),
			__( 'Settings', 'email-capture-lead-generation' ),
			'manage_options',
			'eclg-settings',
			array(
				$this,
				'eclg_settings_page_cb',
			)
		);

		/**
		 * @since 1.0.2
		 */
		add_submenu_page(
			'eclg-list',
			__( 'Integration', 'email-capture-lead-generation' ),
			__( 'Integration', 'email-capture-lead-generation' ),
			'manage_options',
			'eclg-integration',
			array(
				$this,
				'eclg_integration_page_cb',
			)
		);

		// add_action( "admin_head-$eclg_setting", array() );
	}


	public function eclg_save_data() {
		$submitted_data = ! empty( $_POST['eclg_doing_ajax'] ) ? $_POST : null;

		if ( ! $submitted_data ) {
			return;
		}

		/**
		 * We don't want this key in our db.
		 */
		if ( isset( $submitted_data['eclg_doing_ajax'] ) ) {
			unset( $submitted_data['eclg_doing_ajax'] );
		}

		$all_options = get_option( 'eclg_options', array() );

		$all_options = array_replace_recursive( $all_options, $submitted_data );

		update_option( 'eclg_options', $all_options );

		wp_send_json_success( $all_options );
	}


	/**
	 * Settings page callback function.
	 *
	 * @since 1.0.2
	 */
	public function eclg_settings_page_cb() {
		?>
		<div class="wrap">
			<h1 class="wp-heading-inline">
				<?php esc_html_e( 'Settings', 'email-caption-lead-generation' ); ?>
			</h1>

			<div class="eclg-settings-container">
				<div id="eclg-settings"></div>
			</div>
		</div>
		<?php
	}


	/**
	 * Ingration page callback function.
	 *
	 * @since 1.0.2
	 */
	public function eclg_integration_page_cb() {
		?>
		<div class="wrap">
			<h1 class="wp-heading-inline">
				<?php esc_html_e( 'Integration', 'email-caption-lead-generation' ); ?>
			</h1>

			<div class="eclg-integration-container">
				<div id="eclg-integration"></div>
			</div>
		</div>
		<?php
	}



	/**
	 * Includes Newsletter List
	 *
	 * Including File for Newsletter listing
	 *
	 * @package Email Capture & Lead Generation
	 * @since 1.0.0
	 */
	public function eclg_ltable_newsletter_list() {

		include_once ECLG_ADMIN_DIR . '/forms/eclg-email-capture-list.php';

	}


	/**
	 * Bulk Action
	 *
	 * @package Email Capture & Lead Generation
	 * @since 1.0.0
	 */
	public function wpesn_ltable_process_bulk_action() {

		// check if action is not blank and if page is newsletter listing page
		if ( ( ( isset( $_GET['action'] ) && $_GET['action'] == 'delete' ) || ( isset( $_GET['action2'] ) && $_GET['action2'] == 'delete' ) ) && isset( $_GET['page'] ) && $_GET['page'] == 'eclg-list' ) { // check action and page

			global $wpdb;

			// get redirect url
			$redirect_url = add_query_arg( array( 'page' => 'eclg-list' ), admin_url( 'admin.php' ) );

			$eclg_id = array();
			if ( isset( $_GET['eclg_id'] ) ) {
				$eclg_id = array_map(
					function( $record_id ) {
						return absint( $record_id );
					},
					$_GET['eclg_id']
				);
			}

			if ( count( $eclg_id ) > 0 ) { // check if any checkbox is selected

				$table_name = $wpdb->prefix . 'eclg_subscribers';

				// Delete bulk subsribers
				foreach ( $eclg_id as $key => $value ) {
					$wpdb->delete( $table_name, array( 'ID' => absint( $value ) ) );
				}

				$redirect_url = add_query_arg( array( 'message' => '3' ), $redirect_url );

				wp_redirect( $redirect_url );
				exit;

			} else {

				wp_redirect( $redirect_url );
				exit;
			}
		}

		if ( ( isset( $_GET['export'] ) && $_GET['export'] == 'Export CSV' ) && isset( $_GET['page'] ) && $_GET['page'] == 'eclg-list' ) {

				global $wpdb;
				$table_name = $wpdb->prefix . 'eclg_subscribers';
				$query      = "SELECT * FROM $table_name";

			if ( isset( $_GET['eclg_id'] ) ) {
				$query .= ' WHERE ';
				foreach ( $_GET['eclg_id'] as $id ) {
					$query .= ' id = ' . absint( $id ) . ' || ';
				}
				$query = rtrim( $query, '|| ' );
			}

				$data = $wpdb->get_results( $query, 'ARRAY_A' );

				$csv_output = "First Name,Last Name,Email,User IP,Created Date \n";
			foreach ( $data as $dt ) {
				extract( $dt );
				// $date = date("F d Y h:i A",strtotime($date));
				$csv_output .= "$first_name,$last_name,$email,$user_ip,$date\n";
			}

				$cdt = date( 'd-M-Y' );
				header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
				header( 'Content-Description: File Transfer' );
				header( 'Content-type: text/csv' );
				header( 'Content-Disposition: attachment; filename= eclg-subscribers-' . $cdt . '.csv' );
				header( 'Expires: 0' );
				header( 'Pragma: public' );
				echo $csv_output;
				exit;
		}

	}

}

return new Eclg_Admin();
