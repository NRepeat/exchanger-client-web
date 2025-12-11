<template>
  <div>
      <div class="container">

        <div class="contact-page-top">
          <div class="container news-page-top">
            <h1>{{ $t('page.merchants.integration') }}</h1>
            <p>{{ $t('page.merchants.merchant') }}</p>
          </div>
        </div>
      </div>
    <div class="container p20">
    <div class="specification-info">
      <img src="~/assets/img/diagram-merchant.png" width="100%" />

      <h4 class="title">
        {{ $t('page.merchants.createOrder') }}
      </h4>
      <p> {{ $t('page.merchants.useMethod') }} <b>public/exchanger/order/create</b></p>
      <div class="table__param" style="border: 1px solid;padding: 5px;margin: 10px">
        <table>
          <thead>
            <tr style="font-weight: bold">
              <td width="200px">{{ $t('page.merchants.name') }}</td>
              <td>{{ $t('page.merchants.description') }}</td>
              <td width="100px">{{ $t('page.merchants.type') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>routeId</td>
              <td>{{ $t('page.merchants.idRoute') }}</td>
              <td>ObjectID</td>
            </tr>
            <tr>
              <td>partner</td>
              <td>{{ $t('page.merchants.linkPartner') }}</td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>amount</td>
              <td>{{ $t('page.merchants.amount') }}</td>
              <td>FLOAT</td>
            </tr>
            <tr>
              <td>fromValues[0][key]</td>
              <td>{{ $t('page.merchants.key') }}</td>
              <td>ObjectID</td>
            </tr>
            <tr>
              <td>fromValues[0][value]</td>
              <td>{{ $t('page.merchants.value') }}</td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>toValues[0][key]</td>
              <td>{{ $t('page.merchants.key') }}</td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>toValues[0][value]</td>
              <td>{{ $t('page.merchants.value') }}</td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>routeValues[0][key]</td>
              <td>{{ $t('page.merchants.key') }}</td>
              <td>ObjectID</td>
            </tr>
            <tr>
              <td>routeValues[0][value]</td>
              <td>{{ $t('page.merchants.value') }}</td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>lang</td>
              <td>{{ $t('page.merchants.lang') }}</td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>agreement</td>
              <td>{{ $t('page.merchants.agreement') }}</td>
              <td>BOOLEAN</td>
            </tr>
            <tr>
              <td>hideOutData</td>
              <td>{{ $t('page.merchants.hideOutData') }}</td>
              <td>BOOLEAN</td>
            </tr>
            <tr>
              <td>clientCallbackUrl</td>
              <td>{{ $t('page.merchants.clientCallbackUrl') }} ?status=success {{ $t('page.merchants.or') }}
                ?status=error
              </td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>ipnUrl</td>
              <td>{{ $t('page.merchants.paymentNotificationURL') }} ({{ $t('page.merchants.ipnUrl1') }})</td>
              <td>STRING</td>
            </tr>
            <tr>
              <td>ipnSecret</td>
              <td>{{ $t('page.merchants.ipnSecret') }}</td>
              <td>STRING</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        {{ $t('page.merchants.doc') }}
        <!-- <a href="/service/api/v1/docs/#/" target="_blank" style="color: blue">API docs page</a> -->
      </p>
      <h4 class="title">
        IPN ({{ $t('page.merchants.notify') }})
      </h4>

      <p>
        {{ $t('page.merchants.titleNotifyIpn') }}
      </p>

      <ul>
        <li>
          <code>clientCallbackUrl</code> - {{ $t('page.merchants.clientCallbackUrl') }}
        </li>

        <li><code>hideOutData</code> - {{ $t('page.merchants.hideOutData1') }}</li>

        <li><code>ipnUrl</code> - {{ $t('page.merchants.ipnUrl') }}</li>

        <li><code>ipnSecret</code> - {{ $t('page.merchants.ipnSecret1') }}
        </li>
      </ul>

      <ol>
        <li>{{ $t('page.merchants.subTitleIpn1') }}</li>

        <li>{{ $t('page.merchants.subTitleIpn2') }}</li>

        <li>{{ $t('page.merchants.subTitleIpn3') }}</li>
      </ol>

      <h4 class="title">
        {{ $t('page.merchants.exampleIpn') }}
      </h4>
      <ul>
        <li>POST</li>
        <li>['Content-Type'] = 'application/x-www-form-urlencoded'</li>
        <br/>
        <br/>
        <li><code>orderUID</code> :Number() - {{ $t('page.merchants.order') }} uid</li>
        <li><code>orderId</code> :String(ObjectId) -{{ $t('page.merchants.order') }} id</li>
        <li><code>newStatus</code> :String() - {{ $t('page.merchants.order') }} {{ $t('page.merchants.currentStatus') }}
        </li>
        <li><code>inAmount</code> :String(number) - order in sum</li>
        <li><code>outAmount</code> :String(number) - order out sum</li>
        <li><code>xml_from</code> :String() - {{ $t('page.merchants.order') }} uid</li>
        <li><code>xml_to</code> :String() - {{ $t('page.merchants.order') }} uid</li>
        <li><code>timestamp</code> :Number() - {{ $t('page.merchants.timestamp') }}</li>
        <li><code>toValues</code> :Array([{key,name,value}]) - {{ $t('page.merchants.toValues') }}</li>
      </ul>

      <h4 class="title">
        {{ $t('page.merchants.statusesList') }}
      </h4>
      <ul>
        <li><code>new</code> - {{ $t('page.merchants.new') }}</li>
        <li><code>waitPayment</code> - {{ $t('page.merchants.waitPayment') }}</li>
        <li><code>errorPayment</code> - {{ $t('page.merchants.errorPayment') }}</li>
        <li><code>inProgress</code> - {{ $t('page.merchants.inProgress') }}</li>
        <li>
          <code>inProgressPayout</code> - {{ $t('page.merchants.inProgressPayout') }}
        </li>
        <li><code>errorPayout</code> - {{ $t('page.merchants.errorPayout') }}</li>
        <li><code>hold</code> - {{ $t('page.merchants.hold') }}</li>
        <li><code>done</code> - {{ $t('page.merchants.done') }}</li>
        <li>
          <code>returned</code> - {{ $t('page.merchants.returned') }}
        </li>
        <li><code>deleted</code> - {{ $t('page.merchants.deleted') }}</li>
      </ul>
      <h4 class="title">
        {{ $t('page.merchants.verification') }}
      </h4>

      <p><em>sha256(orderId:newStatus:inAmount:outAmount:xml_from:xml_to:timestamp:ipnSecret)</em></p>

      <pre>
        <code>
const stringForHash = orderId+":"+newStatus+":"+inAmount+":"+outAmount+":"+xml_from+":"+xml_to+":"+timestamp+":"+ipnSecret;
// example string for hash 5d8e6002b80b7b4cd75a6424:inProgress:2:317.42:ETH:WMZ:1571328406072:SECRET123

const hash = crypto.createHash('sha256').update(stringForHash).digest('hex')
// example hash af3acf947e6f0e0f2c267e300b8582e504dba12d1f2d058652b7414163c09f48
        </code>
      </pre>

      <h4 class="title">
        {{ $t('page.merchants.paymentControl') }}
      </h4>

      <ol>
        <li>
          {{ $t('page.merchants.paymentControlTitle') }}
        </li>
        <li>
          {{ $t('page.merchants.paymentControlTitle1') }}
        </li>
      </ol>

      <h4 class="title">
        {{ $t('page.merchants.payment') }}
      </h4>

      <ol>
        <li>
          {{ $t('page.merchants.paymentTitle') }}
          <br/>
          <br/>
          <code>
            // schema<br />
            {{ $rest.baseUrl }}/user-lang/payment/order-uid/order-secret<br />
            // example result<br />
            {{ $rest.baseUrl }}/en/payment/1409/dGqwF2M2eBPaSN1G5ljMS1cb
          </code>
        </li>

        <li>
          {{ $t('page.merchants.paymentTitle1') }}
        </li>

        <li>
          {{ $t('page.merchants.paymentTitle2') }}
        </li>
      </ol>
    </div>
    </div>
  </div>
</template>

<script>
export default {


};
</script>
