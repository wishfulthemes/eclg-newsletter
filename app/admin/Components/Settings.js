/**
 * Admin settings page component.
 *
 * @package email-capture-lead-generation
 * @since 1.0.2
 */

import { useState, useEffect } from '@wordpress/element'
import { Panel, PanelBody, PanelRow, ToggleControl, TextControl, Spinner, ClipboardButton, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';


const settingsDefault = () => {
    return {
        displayFirstName: 'yes',
        displayLastName: 'yes',
        buttonLabel: __('Submit', 'email-capture-lead-generation'),
    }
}


/**
 * Settings page main component.
 *
 * @since 1.0.2
 */
const Settings = () => {

    const { eclg_options } = eclg_data;

    const { eclg_settings } = eclg_options;

    const [settingsData, setSettingsData] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(function () {

        let data = {};
        data = 'undefined' !== typeof eclg_settings ? eclg_settings : settingsDefault();

        setSettingsData(data);
        setIsLoading(false);
    }, []);


    const { displayFirstName, displayLastName, buttonLabel } = settingsData;


    const onSaveButtonClicked = () => {

        setIsSaving(true);

        let data = new FormData();

        data.append('eclg_settings[displayFirstName]', displayFirstName);
        data.append('eclg_settings[displayLastName]', displayLastName);
        data.append('eclg_settings[buttonLabel]', buttonLabel);
        data.append('eclg_doing_ajax', 'yes');

        // POST
        apiFetch({
            url: `${ajaxurl}?action=eclg_save_data`,
            method: 'post',
            body: data,
        }).then(res => {
            setIsSaving(false);
        });
    }


    return (

        <div className="eclg-fields-container">

            <div className="eclg-fields-left">

                <Panel header={__('Shortcode and Settings', 'email-capture-lead-generation')}>

                    {
                        isLoading ?

                            <Spinner />

                            :

                            <>

                                <PanelBody title={__('Shortcode', 'email-capture-lead-generation')}>
                                    <Shortcode settingsData={settingsData} />
                                </PanelBody>

                                <PanelBody title={__('Settings', 'email-capture-lead-generation')}>

                                    <PanelRow>
                                        <label>{__('Display first name field in subscription form?', 'email-capture-lead-generation')}</label>
                                        <div className="email-capture-lead-generation-field-wrapper">
                                            <ToggleControl
                                                checked={displayFirstName == 'yes'}
                                                onChange={
                                                    () => {
                                                        let isChecked = displayFirstName == 'yes' ? 'no' : 'yes';
                                                        setSettingsData({
                                                            ...settingsData,
                                                            displayFirstName: isChecked
                                                        });
                                                    }
                                                }
                                            />
                                        </div>
                                    </PanelRow>

                                    <PanelRow>
                                        <label>{__('Display last name field in subscription form?', 'email-capture-lead-generation')}</label>
                                        <div className="email-capture-lead-generation-field-wrapper">
                                            <ToggleControl
                                                checked={displayLastName == 'yes'}
                                                onChange={
                                                    () => {
                                                        let isChecked = displayLastName == 'yes' ? 'no' : 'yes';
                                                        setSettingsData({
                                                            ...settingsData,
                                                            displayLastName: isChecked
                                                        });
                                                    }
                                                }
                                            />
                                        </div>
                                    </PanelRow>

                                    <PanelRow>
                                        <label>{__('Subscription form button label', 'email-capture-lead-generation')}</label>
                                        <div className="email-capture-lead-generation-field-wrapper">
                                            <TextControl
                                                value={buttonLabel ? buttonLabel : ''}
                                                onChange={
                                                    (value) => {
                                                        setSettingsData({
                                                            ...settingsData,
                                                            buttonLabel: value
                                                        })
                                                    }
                                                }
                                            />
                                        </div>
                                    </PanelRow>

                                </PanelBody>

                            </>
                    }

                </Panel>

            </div>


            <div className="eclg-fields-right">

                <Panel header="">

                    <PanelBody title={__('Save Settings', 'email-capture-lead-generation')}>

                        <PanelRow>

                            <Button
                                isBusy={isSaving}
                                disabled={isSaving || isLoading}
                                onClick={() => onSaveButtonClicked()}
                                className="eclg-save-button"
                                isPrimary>
                                {isSaving ? __('Saving', 'email-capture-lead-generation') : __('Save', 'email-capture-lead-generation')}
                            </Button>

                        </PanelRow>

                    </PanelBody>

                </Panel>

            </div>

        </div>

    );
};



const Shortcode = ({ settingsData }) => {
    const { displayFirstName, displayLastName, buttonLabel } = settingsData;

    const [hasCopied, setHasCopied] = useState(false);

    let shortCodeText = `[eclg_capture firstname="${displayFirstName}" lastname="${displayLastName}"  button_text="${buttonLabel}"]`;
    return (
        <>
            <PanelRow>
                <label>
                    <code>{shortCodeText}</code>
                </label>


                <div className="email-capture-lead-generation-field-wrapper">
                    <ClipboardButton
                        isSecondary
                        text={shortCodeText}
                        onCopy={() => setHasCopied(true)}
                        onFinishCopy={() => setHasCopied(false)}
                    >
                        {hasCopied ? __('Shortcode Copied!', 'email-capture-lead-generation') : __('Copy Shortcode', 'email-capture-lead-generation')}
                    </ClipboardButton>
                </div>

            </PanelRow>


        </>
    );
}


export default Settings;