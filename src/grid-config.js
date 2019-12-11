import resources from './resources.json';

const lang =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const documents = {
    letters: {
        title: resources['lettertitle'][lang],
        type: 19,
        link: 'LettersAddEdit',
        popup: '',
        addPermission: 48,
        editPermission: 49,
        deletePermission: 50,
        viewPermission: 51,
        permission: 52,
        actions: [
            {
                title: 'DELETE',
                handleClick: checked => {
                    alert('Deleted!!!');
                },
                classes: '',
            },
        ],
        rowActions: [
            {
                title: 'Send',
                handleClick: item => {
                    alert(`Sent ${item.subject}!!!`);
                },
            },
        ],
        api: {
            fetch: 'GetLettersByProjectId',
            customizedFetch: 'GetLettersByProjectIdCustom',
            delete: 'DeletMultipleLettersById',
        },
        cells: [
            {
                title: '',
                type: 'check-box',
                fixed: true,
                field: 'id',
            },
            {
                title: resources['numberAbb'][lang],
                field: 'arrange',
                type: 'text',
                width: 3,
                groupable: false,
                fixed: true,
                sortable: true,
                onClick: cell => {
                    console.log(cell);
                },
            },
            {
                title: resources['status'][lang],
                field: 'statusName',
                type: 'text',
                width: 7,
                groupable: true,
                fixed: true,
                sortable: true,
                leftPadding: 12,
                classes: ' grid-status',
            },
            {
                title: resources['subject'][lang],
                showTip: true,
                field: 'subject',
                type: 'text',
                width: 20,
                hasRightBorder: true,
                groupable: true,
                fixed: true,
                classes: ' subject',
            },
            {
                title: resources['fromCompany'][lang],
                showTip: true,
                field: [
                    {
                        field: 'fromCompanyName',
                        type: 'text',
                    },
                    {
                        field: 'fromContactName',
                        type: 'text',
                        classes: 'secondary-text',
                    },
                ],
                type: 'text',
                width: 15,
                groupable: true,
            },
            {
                title: resources['toCompany'][lang],
                showTip: true,
                field: [
                    {
                        field: 'toCompanyName',
                        type: 'text',
                    },
                    {
                        field: 'toContactName',
                        type: 'text',
                        classes: 'secondary-text',
                    },
                ],
                type: 'text',
                width: 15,
                groupable: true,
            },
            {
                title: resources['openedBy'][lang],
                field: 'openedBy',
                type: 'text',
                width: 8,
                groupable: true,
            },
            {
                title: resources['sendDate'][lang],
                field: 'sendDate',
                type: 'date',
                sortable: true,
                width: 15,
                groupable: true,
            },
            {
                title: resources['docClosedate'][lang],
                field: 'docCloseDate',
                type: 'date',
                sortable: true,
                width: 8,
                groupable: true,
            },
            {
                title: resources['disciplineName'][lang],
                field: 'disciplineName',
                type: 'text',
                width: 15,
                groupable: true,
            },
            {
                title: resources['docDate'][lang],
                field: 'docDate',
                type: 'date',
                sortable: true,
                width: 15,
                groupable: true,
            },
            {
                title: resources['replyDate'][lang],
                field: 'replyDate',
                type: 'date',
                sortable: true,
                width: 15,
                groupable: true,
            },
            {
                title: resources['refDoc'][lang],
                field: 'refDoc',
                type: 'text',
                width: 3,
                groupable: true,
            },
            {
                title: resources['lastSendTime'][lang],
                field: 'lastSendTime',
                type: 'text',
                width: 15,
                groupable: true,
            },
            {
                title: resources['lastApproveDate'][lang],
                field: 'lastApproveDate',
                type: 'date',
                sortable: true,
                width: 15,
                groupable: true,
            },
            {
                title: resources['lastApprovedTime'][lang],
                field: 'lastApproveTime',
                type: 'text',
                width: 15,
                groupable: true,
            },
        ],
    },
};

export default documents;
