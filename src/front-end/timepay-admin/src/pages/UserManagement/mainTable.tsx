import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IGetUserInfoRequest, IUserInfo } from '../../api/interfaces/IUser';
import { useGetUserInfos } from '../../api/hooks/userManagement';
import { mainSearchState } from './mainSearchState';
import { useMemo, useState } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import { customPaginationProps } from '../../utils/pagination';
import { Button, Modal } from 'antd';
import ProfileImageModal from './profileImageModal';

interface MainTableProps {
  selectedUserInfoIds?: React.Key[];
  setSelectedUserInfoIds: (args?: React.Key[]) => void;
  setSelectedUserInfos: (args?: IUserInfo[]) => void;
}

const MainTable = ({
  selectedUserInfoIds,
  setSelectedUserInfoIds,
  setSelectedUserInfos,
}: MainTableProps) => {
  const mainSearchValues = useRecoilValue(mainSearchState);
  const setMainSearch = useSetRecoilState(mainSearchState);

  const { data, isLoading } = useGetUserInfos(mainSearchValues);

  const dataSource = useMemo(() => {
    if (mainSearchValues) {
      return data?.data.content || [];
    }
    return [];
  }, [mainSearchValues, data]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IUserInfo[]) => {
      setSelectedUserInfoIds(selectedRowKeys);
      setSelectedUserInfos(selectedRows);
    },
  };

  const columns: ColumnsType<IUserInfo> = [
    {
      title: 'UID',
      dataIndex: 'userId',
      align: 'center',
    },
    {
      title: '닉네임',
      dataIndex: 'nickName',
      align: 'center',
    },
    {
      title: '프로필 사진',
      dataIndex: 'profileUrl',
      //dataIndex: 'profileModal',
      render: () => (
        <Button type="link" onClick={() => showModalProfileImage()}>
          프로필 사진보기
        </Button>
      ),
      align: 'center',
    },

    {
      title: '이름',
      dataIndex: 'userName',
      align: 'center',
    },

    {
      title: '지역',
      dataIndex: 'region',
      align: 'center',
    },
    {
      title: '성별',
      dataIndex: 'sex',
      align: 'center',
    },
    {
      title: '생년월일',
      dataIndex: 'birth',
      align: 'center',
    },

    {
      title: '타임페이 보유량',
      dataIndex: 'timepay',
      align: 'center',
    },
    {
      title: '봉사 시간',
      dataIndex: 'totalVolunteerTime',
      align: 'center',
    },

    {
      title: '활동 목록',
      dataIndex: 'detail',
      align: 'center',
    },

    {
      title: '정보 수정',
      dataIndex: 'edit',
      align: 'center',
    },
  ];

  /*프로필 사진 모달 설정 */
  const [modalProfileImage, setModalProfileImage] = useState(false);

  const showModalProfileImage = () => {
    setModalProfileImage(true);
  };
  const handleOkProfileImage = () => {
    setModalProfileImage(false);
  };

  const handleCancelProfileImage = () => {
    setModalProfileImage(false);
  };

  return (
    <>
      <div>
        {selectedUserInfoIds && selectedUserInfoIds.length > 0
          ? `${selectedUserInfoIds.length} 개 선택 / `
          : ''}
        총 {data?.data.totalElements || 0} 개
      </div>
      <Table
        //css={cssPushTableStyle}
        rowSelection={rowSelection}
        columns={columns}
        scroll={{ x: 1200 }}
        dataSource={dataSource}
        rowKey="UserId"
        loading={isLoading}
        pagination={customPaginationProps<IGetUserInfoRequest>({
          totalElements: data?.data.totalElements,
          currentSearchValues: mainSearchValues,
          setSearchValues: setMainSearch,
        })}
      />
      <Modal
        title="프로필 사진"
        open={modalProfileImage}
        onOk={handleOkProfileImage}
        onCancel={handleCancelProfileImage}
        okText="확인"
        cancelText="취소"
      ></Modal>
    </>
  );
};

export default MainTable;
