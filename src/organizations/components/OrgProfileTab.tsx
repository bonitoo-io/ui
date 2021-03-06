// Libraries
import React, {PureComponent} from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {RouteComponentProps, withRouter} from 'react-router-dom'

// Components
import {
  Form,
  Button,
  ComponentSize,
  Panel,
  IconFont,
  FlexBox,
  AlignItems,
  FlexDirection,
  Gradients,
  InfluxColors,
  JustifyContent,
  Grid,
  Columns,
} from '@influxdata/clockface'
import {ErrorHandling} from 'src/shared/decorators/errors'
import CopyButton from 'src/shared/components/CopyButton'

import {getOrg} from 'src/organizations/selectors'
import {copyToClipboardSuccess} from 'src/shared/copy/notifications'

// Types
import {ButtonType} from 'src/clockface'
import {AppState} from 'src/types'

type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps & RouteComponentProps<{orgID: string}>

@ErrorHandling
class OrgProfileTab extends PureComponent<Props> {
  public render() {
    return (
      <>
        <Grid.Column widthXS={Columns.Twelve} widthSM={Columns.Six}>
          <Panel backgroundColor={InfluxColors.Onyx}>
            <Panel.Header size={ComponentSize.Small}>
              <h4>Organization Profile</h4>
            </Panel.Header>
            <Panel.Body size={ComponentSize.Small}>
              <Form onSubmit={this.handleShowEditOverlay}>
                <Panel gradient={Gradients.DocScott}>
                  <Panel.Header size={ComponentSize.ExtraSmall}>
                    <h5>Danger Zone!</h5>
                  </Panel.Header>
                  <Panel.Body size={ComponentSize.ExtraSmall}>
                    <FlexBox
                      stretchToFitWidth={true}
                      alignItems={AlignItems.Center}
                      direction={FlexDirection.Row}
                      justifyContent={JustifyContent.SpaceBetween}
                    >
                      <div>
                        <h5 style={{marginBottom: '0'}}>
                          Rename Organization {this.props.org.name}
                        </h5>
                        <p style={{marginTop: '2px'}}>
                          This action can have wide-reaching unintended
                          consequences.
                        </p>
                      </div>
                      <Button
                        testID="rename-org--button"
                        text="Rename"
                        icon={IconFont.Pencil}
                        type={ButtonType.Submit}
                      />
                    </FlexBox>
                  </Panel.Body>
                </Panel>
              </Form>
            </Panel.Body>
          </Panel>
        </Grid.Column>
        <Grid.Column widthXS={Columns.Twelve} widthSM={Columns.Six}>
          <Panel>
            <Panel.Header size={ComponentSize.ExtraSmall}>
              <h4>Common Ids</h4>
            </Panel.Header>
            <Panel.Body>
              <div className="code-snippet" data-testid="code-snippet">
                <div className="code-snippet--text">
                  <pre>
                    <code>{this.props.me.id}</code>
                  </pre>
                </div>
                <div className="code-snippet--footer">
                  <CopyButton
                    text={this.props.me.id}
                    onCopy={this.generateCopyText('User ID', this.props.me.id)}
                  />
                  <label className="code-snippet--label">{`${this.props.me.name} | User ID`}</label>
                </div>
              </div>
              <div className="code-snippet" data-testid="code-snippet">
                <div className="code-snippet--text">
                  <pre>
                    <code>{this.props.org.id}</code>
                  </pre>
                </div>
                <div className="code-snippet--footer">
                  <CopyButton
                    text={this.props.org.id}
                    onCopy={this.generateCopyText(
                      'Organization ID',
                      this.props.org.id
                    )}
                  />
                  <label className="code-snippet--label">{`${this.props.org.name} | Organization ID`}</label>
                </div>
              </div>
            </Panel.Body>
          </Panel>
        </Grid.Column>
      </>
    )
  }

  private handleShowEditOverlay = () => {
    const {
      match: {
        params: {orgID},
      },
      history,
    } = this.props

    history.push(`/orgs/${orgID}/about/rename`)
  }

  private generateCopyText = (title, text) => () => {
    return copyToClipboardSuccess(text, title)
  }
}

const mstp = (state: AppState) => {
  return {
    org: getOrg(state),
    me: state.me,
  }
}

const connector = connect(mstp)

export default connector(withRouter(OrgProfileTab))
