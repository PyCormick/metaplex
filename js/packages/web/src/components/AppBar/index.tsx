import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu, Divider } from 'antd';
import { ConnectButton, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { useMeta } from '../../contexts';
import { SwapOutlined } from '@ant-design/icons';

function logOut() {
  sessionStorage.removeItem('token');
}

const UserActions = () => {
  const { publicKey } = useWallet();
  const { whitelistedCreatorsByCreator, store } = useMeta();
  const pubkey = publicKey?.toBase58() || '';
  const token = sessionStorage.getItem('token');
  let isAuth = !!token;

  const canCreate = useMemo(() => {
    return (
      store?.info?.public ||
      whitelistedCreatorsByCreator[pubkey]?.info?.activated
    );
  }, [ pubkey, whitelistedCreatorsByCreator, store ]);

  return (
    <>
      {store && (
        <>
          <Menu>
            {/* <Link to={`#`}>
            <Button className="app-btn">Bids</Button>
          </Link> */}
          <div>
            {canCreate ? (
              <Link to={`/art/create`}><Button className="app-btn">Create</Button></Link>
            ) : null}
            <Link to={`/auction/create/0`}><Button className="connector" type="primary">Sell</Button></Link>
          </div>
          <Divider type='vertical' style={{ marginLeft: '18px', marginRight: '0', top: 0, height: '40px' }}/>
          <Link to={`/swap`}><Button className="app-btn"><SwapOutlined /> Swap</Button></Link>
          <Divider type='vertical' style={{ marginLeft: '0', marginRight: '0', top: 0, height: '40px' }}/>
          <Link to={isAuth ? '/' : `/login`}>
            <Button onClick={logOut} className="app-btn">{isAuth ? 'Logout' : 'Login'}</Button>
          </Link>
          </Menu>
          <div className="divider" />
        </>
      )}
    </>
  );
};

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
      }}
    >
      <Link to={`/`}>
        <Button className="app-btn">Explore</Button>
      </Link>
      <Link to={`/artworks`}>
        <Button className="app-btn">
          {connected ? 'My Items' : 'Artworks'}
        </Button>
      </Link>
      <Link to={`/artists`}>
        <Button className="app-btn">Creators</Button>
      </Link>
    </div>
  );
};

const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const { connected } = useWallet();

  if (width < 768)
    return (
      <>
        <Dropdown
          arrow
          placement="bottomLeft"
          trigger={[ 'click' ]}
          overlay={
            <Menu>
              <Menu.Item>
                <Link to={`/`}>
                  <Button className="app-btn">Explore</Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/artworks`}>
                  <Button className="app-btn">
                    {connected ? 'My Items' : 'Artworks'}
                  </Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/artists`}>
                  <Button className="app-btn">Creators</Button>
                </Link>
              </Menu.Item>
            </Menu>
          }
        >
          <MenuOutlined style={{ fontSize: '1.4rem' }} />
        </Dropdown>
      </>
    );

  return <DefaultActions />;
};

export const AppBar = () => {
  const { connected } = useWallet();

  return (
    <>
      <div className="app-left app-bar-box">
        {window.location.hash !== '#/analytics' && <Notifications />}
        <div className="divider" />
        <MetaplexMenu />
      </div>
      {connected ? (
        <div className="app-right app-bar-box">
          <UserActions />
          <Divider type='vertical' style={{ marginLeft: '0', marginRight: '0', top: 0, height: '40px' }}/>
          <CurrentUserBadge
            showBalance={false}
            showAddress={false}
            iconSize={24}
          />
        </div>
      ) : (
        <ConnectButton type="primary" allowWalletChange />
      )}
    </>
  );
};
