/**
 * Admin settings page component.
 *
 * @package email-capture-lead-generation
 * @since 1.0.2
 */

import { useState, useEffect } from '@wordpress/element'
import { Panel, PanelBody, PanelRow, ToggleControl, TextControl, Spinner, ClipboardButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';


const Shortcode = (props) => {
    const { displayFirstName, displayLastName, buttonLabel } = props.settingsData;

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

/**
 * Settings page main component.
 *
 * @since 1.0.2
 */
const Settings = () => {

    const [settingsData, setSettingsData] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    useEffect(function () {
        setSettingsData(
            {
                displayFirstName: 'yes',
                displayLastName: 'yes',
                buttonLabel: __('Submit', 'email-capture-lead-generation'),
            }
        );

        setIsLoading(false);
    }, []);

    const { displayFirstName, displayLastName, buttonLabel } = settingsData;

    return (
        <>

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
                                <form>
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

                                </form>
                            </PanelBody>

                        </>
                }

            </Panel>

        </>
    );
};

export default Settings;