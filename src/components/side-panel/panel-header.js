// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component, useEffect,useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {createSelector} from 'reselect';
import {Tooltip} from 'components/common/styled-components';
import KeplerGlLogo from 'components/common/logo';
import {Save, DataTable, Save2,OrderByList, Picture, Map as MapIcon, Share} from 'components/common/icons';
import ClickOutsideCloseDropdown from 'components/side-panel/panel-dropdown';
import Toolbar from 'components/common/toolbar';
import ToolbarItem from 'components/common/toolbar-item';
import {FormattedMessage} from 'localization';

import {getMapJSON} from 'utils/export-utils';

const StyledPanelHeader = styled.div.attrs({
  className: 'side-side-panel__header'
})`
  background-color: ${props => props.theme.sidePanelHeaderBg};
  padding: 12px 16px 0 16px;
`;

const StyledPanelHeaderTop = styled.div.attrs({
  className: 'side-panel__header__top'
})`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  width: 100%;
`;

const StyledPanelTopActions = styled.div.attrs({
  className: 'side-panel__top__actions'
})`
  display: flex;
`;

const StyledPanelAction = styled.div.attrs({
  className: 'side-panel__panel-header__action'
})`
  align-items: center;
  border-radius: 2px;
  color: ${props => (props.active ? props.theme.textColorHl : props.theme.subtextColor)};
  display: flex;
  height: 26px;
  justify-content: space-between;
  margin-left: 4px;
  padding: 5px;
  font-weight: bold;
  p {
    display: inline-block;
    margin-right: 6px;
  }
  a {
    height: 20px;
  }

  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};

    a {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const StyledToolbar = styled(Toolbar)`
  position: absolute;
`;

export const PanelAction = ({item, onClick}) => (
  <StyledPanelAction data-tip data-for={`${item.id}-action`} onClick={onClick}>
    {item.label ? <p>{item.label}</p> : null}
    <a target={item.blank ? '_blank' : ''} href={item.href} rel="noreferrer">
      <item.iconComponent height="20px" {...item.iconComponentProps} />
    </a>
    {item.tooltip ? (
      <Tooltip id={`${item.id}-action`} place="bottom" delayShow={500} effect="solid">
        <FormattedMessage id={item.tooltip} />
      </Tooltip>
    ) : null}
  </StyledPanelAction>
);

export const PanelHeaderDropdownFactory = () => {
  const PanelHeaderDropdown = ({items, show, onClose, id}) => {
    return (
      <StyledToolbar show={show} className={`${id}-dropdown`}>
        <ClickOutsideCloseDropdown
          className="panel-header-dropdown__inner"
          show={show}
          onClose={onClose}
        >
          {items.map(item => (
            <ToolbarItem
              id={item.key}
              key={item.key}
              label={item.label}
              icon={item.icon}
              onClick={item.onClick}
              onClose={onClose}
            />
          ))}
        </ClickOutsideCloseDropdown>
      </StyledToolbar>
    );
  };

  return PanelHeaderDropdown;
};


export const PanelHeaderDropdown2Factory = () => {
  const PanelHeaderDropdown2 = ({show, onClose, id}) => {
    
    const [items, setItems] = useState([{key:1,link:"#","name":"samplefile.csv"}])

    function getRecentFiles(){
      fetch('http://0.0.0.0:8080/fs/recentFiles')
        .then((response) => response.json())
        .then((responseJson) => {
          setItems(responseJson.recentFiles)
        })
        .catch((error) => {
          console.error(error);
        });
    }

    useEffect(() =>
      { 
        getRecentFiles()
      },[])

    // var items = [{key:1,link:"#","name":"file1.csv"}]
    return (
      <StyledToolbar show={show} className={`${id}-dropdown`}>
        <ClickOutsideCloseDropdown
          className="panel-header-dropdown__inner"
          show={show}
          onClose={onClose}
        >
          <div style={{margin:"5px 5px 5px 5px",width:"400px", display:"flex",flexDirection:"column"}}>
            
            <div onClick={getRecentFiles} style={{display:"flex",flexDirection:"row"}}>
              <div style={{margin:"5px",fontSize:"14px",color:"#FFF"}}>
                Recent files
              </div>
              <div onClick={getRecentFiles} style={{margin:"5px",fontSize:"12px",color:"#FFF", cursor:"pointer", "textDecoration":"underline"}}>
                (Refresh)
              </div>
            </div>
            
            {items.map(item => (
              <div style={{display:"flex",flexDirection:"row"}}>
              <div style={{margin:"5px",fontSize:"11px",color:"#DDD"}}>
                {item.created} -
              </div> 
              <a style={{margin:"5px",fontSize:"11px",color:"#FFF","textDecoration":"underline"}} 
                target="_blank" rel="noopener" 
                href={"/kepler/map?url="+item.link} key={item.key}>{item.name}</a>
              </div>
            ))}

          </div>
        </ClickOutsideCloseDropdown>
      </StyledToolbar>
    );
  };

  return PanelHeaderDropdown2;
};

const getDropdownItemsSelector = () =>
  createSelector(
    props => props,
    props =>
      props.items
        .map(t => ({
          ...t,
          onClick: t.onClick && t.onClick(props) ? t.onClick(props) : null
        }))
        .filter(l => l.onClick)
  );

export const SaveExportDropdownFactory = PanelHeaderDropdown => {
  const dropdownItemsSelector = getDropdownItemsSelector();

  const SaveExportDropdown = props => (
    <PanelHeaderDropdown
      items={dropdownItemsSelector(props)}
      show={props.show}
      onClose={props.onClose}
      id="save-export"
    />
  );

  SaveExportDropdown.defaultProps = {
    items: [
      {
        label: 'toolbar.exportImage',
        icon: Picture,
        key: 'image',
        onClick: props => props.onExportImage
      },
      {
        label: 'toolbar.exportData',
        icon: DataTable,
        key: 'data',
        onClick: props => props.onExportData
      },
      {
        label: 'toolbar.exportMap',
        icon: MapIcon,
        key: 'map',
        onClick: props => props.onExportMap
      },
      {
        label: 'toolbar.saveMap',
        icon: Save2,
        key: 'save',
        onClick: props => props.onSaveMap
      },
      {
        label: 'toolbar.shareMapURL',
        icon: Share,
        key: 'share',
        onClick: props => props.onShareMap
      }
    ]
  };

  return SaveExportDropdown;
};
SaveExportDropdownFactory.deps = [PanelHeaderDropdownFactory];

export const CloudStorageDropdownFactory = PanelHeaderDropdown => {
  const dropdownItemsSelector = getDropdownItemsSelector();

  const CloudStorageDropdown = props => (
    <PanelHeaderDropdown
      items={dropdownItemsSelector(props)}
      show={props.show}
      onClose={props.onClose}
      id="cloud-storage"
    />
  );
  CloudStorageDropdown.defaultProps = {
    items: [
      {
        label: 'Save',
        icon: Save2,
        key: 'save',
        onClick: props => props.onSaveToStorage
      },
      {
        label: 'Save As',
        icon: Save2,
        key: 'saveAs',
        onClick: props => props.onSaveAsToStorage
      }
    ]
  };
  return CloudStorageDropdown;
};


export const RecentFilesDropdownFactory = PanelHeaderDropdown2 => {
  // const dropdownItemsSelector = getDropdownItemsSelector();

  const RecentFilesDropdown = props => (
    <PanelHeaderDropdown2
      show={props.show}
      onClose={props.onClose}
      id="recent-files"
    />
  );
  RecentFilesDropdown.defaultProps = {
    items: [{key:1,link:"#","name":"no files to show"}]
  };
  return RecentFilesDropdown;
};

RecentFilesDropdownFactory.deps = [PanelHeaderDropdown2Factory];

CloudStorageDropdownFactory.deps = [PanelHeaderDropdownFactory];

PanelHeaderFactory.deps = [SaveExportDropdownFactory, CloudStorageDropdownFactory,RecentFilesDropdownFactory];




function save2server(props){
  var data = getMapJSON(props,{hasData: true})
  // console.log(data)
  
  const requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
        redirect: 'follow'
  };

  fetch('http://0.0.0.0:3000/fs/uploadJson', requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
      });
}


function PanelHeaderFactory(SaveExportDropdown, CloudStorageDropdown,RecentFilesDropdown) {
  return class PanelHeader extends Component {
    static propTypes = {
      appName: PropTypes.string,
      appWebsite: PropTypes.string,
      version: PropTypes.string,
      visibleDropdown: PropTypes.string,
      logoComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
      actionItems: PropTypes.arrayOf(PropTypes.any),
      onExportImage: PropTypes.func,
      onExportData: PropTypes.func,
      onExportConfig: PropTypes.func,
      onExportMap: PropTypes.func,
      onSaveToStorage: PropTypes.func,
      onSaveAsToStorage: PropTypes.func,
      onSaveMap: PropTypes.func,
      onShareMap: PropTypes.func,

      mapStyle: PropTypes.object,
      visState: PropTypes.object,
      mapState: PropTypes.object
    };



    static defaultProps = {
      
      logoComponent: KeplerGlLogo,
      actionItems: [
        {
          id: 'storage',
          iconComponent: Save2,
          tooltip: 'Save new version',
          onClick: (props) => {
            save2server(props)
          }
        },
        {
          id: 'recentfiles',
          iconComponent: OrderByList,
          tooltip: 'Recent files',
          onClick: () => {},
          dropdownComponent:RecentFilesDropdown,
        },
        {
          id: 'save',
          iconComponent: Save,
          onClick: () => {},
          label: '',
          dropdownComponent: SaveExportDropdown
        }
      ]
    };

    render() {
      const {
        appName,
        appWebsite,
        version,
        actionItems,
        visibleDropdown,
        showExportDropdown,
        hideExportDropdown,
        ...dropdownCallbacks
      } = this.props;
      let items = actionItems || [];

      // don't render cloud storage icon if onSaveToStorage is not provided
      if (typeof this.props.onSaveToStorage !== 'function') {
        items = actionItems.filter(ai => ai.id !== 'storage');
      }

      return (
        <StyledPanelHeader className="side-panel__panel-header">
          <StyledPanelHeaderTop className="side-panel__panel-header__top">
            <this.props.logoComponent appName={appName} version={version} appWebsite={appWebsite} />
            <StyledPanelTopActions>
              {items.map(item => (
                <div
                  className="side-panel__panel-header__right"
                  key={item.id}
                  style={{position: 'relative'}}
                >
                  <PanelAction
                    item={item}
                    onClick={() => {
                      if (item.dropdownComponent) {
                        showExportDropdown(item.id);
                      } else {
                        item.onClick && item.onClick(this.props);
                      }
                    }}
                  />
                  {item.dropdownComponent ? (
                    <item.dropdownComponent
                      onClose={hideExportDropdown}
                      show={visibleDropdown === item.id}
                      {...dropdownCallbacks}
                    />
                  ) : null}
                </div>
              ))}
            </StyledPanelTopActions>
          </StyledPanelHeaderTop>
        </StyledPanelHeader>
      );
    }
  };
}

export default PanelHeaderFactory;
